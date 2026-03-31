from sqlalchemy import Column, Integer, String, Text
from .database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    transcript = Column(Text)