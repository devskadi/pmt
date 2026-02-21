# ============================================
# PMT Backend — Dockerfile
# ============================================
# Multi-stage build for production optimization

# ---------- Stage 1: Builder ----------
FROM python:3.12-slim AS builder

WORKDIR /build

COPY requirements/base.txt requirements/base.txt
COPY requirements/prod.txt requirements/prod.txt

RUN pip install --no-cache-dir --prefix=/install -r requirements/prod.txt

# ---------- Stage 2: Runtime ----------
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/install/bin:$PATH" \
    PYTHONPATH="/install/lib/python3.12/site-packages:$PYTHONPATH"

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /install

# Copy application code
COPY . .

# Create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:8000/health')" || exit 1

CMD ["gunicorn", "app.main:app", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", \
     "--timeout", "120"]
