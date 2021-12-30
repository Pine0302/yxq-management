/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};

  const financeAccounts: string[] = ['nixun'];
  const kfAccounts: string[] = [];

  return {
    canAdmin: currentUser && currentUser.account === 'admin',
    canFinane: currentUser && financeAccounts.includes(currentUser?.access as string),
    canKf: currentUser && kfAccounts.includes(currentUser?.access as string),
  };
}
