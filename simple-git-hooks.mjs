export default {
  'pre-commit': 'pnpm exec lint-staged --concurrent false && pnpm typecheck',
  'pre-push': 'pnpm check',
};
