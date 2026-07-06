import enum

from sqlalchemy import Column, Date, DateTime, Enum, Float, Integer, String, func

from .database import Base


class CategoryEnum(str, enum.Enum):
    housing = "Housing"
    food = "Food"
    transport = "Transport"
    utilities = "Utilities"
    entertainment = "Entertainment"
    health = "Health"
    other = "Other"


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(length=255), nullable=False)
    category = Column(Enum(CategoryEnum), nullable=False, default=CategoryEnum.other)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
