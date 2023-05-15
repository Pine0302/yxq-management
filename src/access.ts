/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};

  const financeAccounts: string[] = ['nixun'];
  const kfAccounts: string[] = ['chenyi', 'gaozhilei', 'chenchen'];

  return {
    canAdmin: currentUser && currentUser.account === 'admin',
    canFinane: currentUser && financeAccounts.includes(currentUser?.account as string),
    canKf: currentUser && kfAccounts.includes(currentUser?.account as string),

    kfMenuFilter: () => true,
  };
}
