export const validateTypeFile = (name: string = ''): boolean => !/\.(jpe?g|png|pdf)$/i.test(name);
