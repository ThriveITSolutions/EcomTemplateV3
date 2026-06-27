export const auth = {};

export const getSession = async () => ({ user: { id: 'dummy-user-id' } });

export const hasPermission = async (userId: string, permission: string) => {
  return true;
};
