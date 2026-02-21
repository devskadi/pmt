# Domain Test Packages
# --------------------
# Tests are organized by domain, mirroring backend/app/domains/.
# Each domain test package contains:
#   test_service.py     — Unit tests for service layer
#   test_repository.py  — Unit tests for repository layer
#   test_router.py      — Integration tests for API endpoints
#   test_models.py      — Unit tests for model validations/constraints
#
# Shared fixtures live in tests/conftest.py.
# Domain-specific fixtures live in tests/domains/{domain}/conftest.py.
