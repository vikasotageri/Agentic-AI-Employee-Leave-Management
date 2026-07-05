FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=7860
ENV DATABASE_URL=sqlite:///./leaveflow.db

EXPOSE 7860

CMD ["sh", "-c", "cd backend && python main.py"]