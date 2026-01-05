# Ecommerce Payment – Notes

## Design Decisions
- Used controller-based API for clarity and maintainability
- Implemented explicit card-type detection based on card number prefix
- Kept frontend minimal and readable to focus on business logic

## Assumptions
- Basic card number validation is sufficient
- Currency assumed as INR

## Trade-offs
- No authentication or database persistence
- Minimal UI styling to prioritize correctness and clarity

## Verification
- Backend logic tested using Swagger
- End-to-end payment flow verified through UI
