from pydantic import BaseModel
from typing import Any, Literal

class SearchResult(BaseModel):
    type: Literal["idea", "user"]
    data: Any