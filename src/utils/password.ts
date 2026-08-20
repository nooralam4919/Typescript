import bcrypt from "bcrypt";

const hashedPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hashedPasswordValue: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPasswordValue);
};

export { hashedPassword, comparePassword };