export interface ActionError {
  isError: boolean;
  message: string;
}

export type ActionFunction = (
  formData: FormData
) => Promise<undefined | ActionError>;
