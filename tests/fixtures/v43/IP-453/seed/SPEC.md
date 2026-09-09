# Account export accepted requirements
AC1: A caller may export only its own account. Reject cross-owner requests before reading a balance into the response.
AC2: Domain export returns numeric balance. Currency formatting belongs to the view; domain export has no view-layer dependency.
AC3: Discounted fee is balance * 0.1 * (1 - discount), including a 50% discount.
Standards: authorization must be checked before returning another owner's data. Use one expression where both branches are identical.
Plan assigned skill: domain-boundaries. Implementation guidance: domain export imports no presentation function. Exactly one implementation evidence record must substantiate that guidance.
