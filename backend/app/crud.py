from datetime import date
from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from . import models, schemas


def get_expense(db: Session, expense_id: int) -> Optional[models.Expense]:
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()


def get_expenses(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[models.CategoryEnum] = None,
) -> List[models.Expense]:
    query = db.query(models.Expense)
    if start_date:
        query = query.filter(models.Expense.date >= start_date)
    if end_date:
        query = query.filter(models.Expense.date <= end_date)
    if category:
        query = query.filter(models.Expense.category == category)
    return (
        query.order_by(models.Expense.date.desc()).offset(skip).limit(limit).all()
    )


def create_expense(db: Session, expense: schemas.ExpenseCreate) -> models.Expense:
    db_expense = models.Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def update_expense(
    db: Session, expense_id: int, expense_update: schemas.ExpenseUpdate
) -> Optional[models.Expense]:
    db_expense = get_expense(db, expense_id)
    if not db_expense:
        return None
    update_data = expense_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_expense, key, value)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_expense(db: Session, db_expense: models.Expense) -> None:
    db.delete(db_expense)
    db.commit()


def get_monthly_summary(db: Session) -> List[schemas.MonthlySummary]:
    rows = (
        db.query(
            func.strftime("%Y-%m", models.Expense.date).label("month"),
            func.sum(models.Expense.amount).label("total"),
        )
        .group_by("month")
        .order_by("month")
        .all()
    )
    return [
        schemas.MonthlySummary(month=row.month, total=row.total or 0)
        for row in rows
    ]


def get_category_summary(db: Session) -> List[schemas.CategorySummary]:
    rows = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount).label("total"),
        )
        .group_by(models.Expense.category)
        .order_by(func.sum(models.Expense.amount).desc())
        .all()
    )
    return [
        schemas.CategorySummary(category=row.category, total=row.total or 0)
        for row in rows
    ]
