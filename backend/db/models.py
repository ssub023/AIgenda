from sqlalchemy import Column, Integer, String, Text
from .database import Base
from sqlalchemy import ForeignKey

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    transcript = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    provider = Column(String)  # google