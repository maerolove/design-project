# ПРАВИЛО: ТЕСТИРОВАНИЕ ПОСЛЕ РЕФАКТОРИНГА

## ВСЕГДА ТЕСТИРОВАТЬ ТЕСТАМИ ПОСЛЕ РЕФАКТОРИНГА
- **NEVER use temporary commands** after refactoring
- **NEVER create temporary files** for testing
- **ALWAYS use existing tests** in the project
- **ALWAYS run pytest** to verify functionality
- **ALWAYS check test results** before declaring success

## Required Actions After Refactoring:
1. **Run existing tests**: `python -m pytest tests/ -v`
2. **Check test coverage** of refactored code
3. **Verify all functionality** works through tests
4. **Fix any test failures** caused by refactoring
5. **Only declare success** when tests pass

## Forbidden Actions:
- Creating temporary curl commands
- Creating temporary test files
- Manual testing without automated tests
- Declaring success without test verification

## Exception:
- Only use manual testing if no tests exist for the functionality
- Always prefer automated tests over manual testing