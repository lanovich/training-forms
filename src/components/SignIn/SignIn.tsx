import { useRef, useState, useCallback, useMemo } from "react";
import { Input } from "../Input";
import styles from "./SignIn.module.css";
import { getValidationErrors, objectHasElements } from "../../utils";
import { SignInSchema, type SignInErrors, type SignInData } from "./model";

interface Props {
  onSubmit: (fields: SignInData) => Promise<void>;
}

export const SignIn = ({ onSubmit }: Props) => {
  const [formState, setFormState] = useState<SignInData>({
    email: "",
    password: "",
  });
  const isSubmittedRef = useRef(false);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasErrors = useMemo(() => objectHasElements(errors), [errors]);

  const resetForm = useCallback(() => {
    setFormState({ email: "", password: "" });
    setErrors({});
    isSubmittedRef.current = false;
  }, []);

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newState = { ...formState, [name]: value };
      setFormState(newState);

      if (isSubmittedRef.current) {
        setErrors(getValidationErrors(SignInSchema, newState));
      }
    },
    [formState]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      isSubmittedRef.current = true;
      setIsSubmitting(true);

      const validationErrors = getValidationErrors(SignInSchema, formState);
      if (objectHasElements(validationErrors)) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(formState);
        resetForm();
      } catch {
        console.warn("Ошибка отправки формы");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, onSubmit, resetForm]
  );

  return (
    <form
      className={styles.formContainer}
      onSubmit={handleSubmit}
      onReset={resetForm}
      noValidate
    >
      <Input
        placeholder="Введите email"
        autoComplete="email"
        name="email"
        type="email"
        value={formState.email}
        onChange={handleFieldChange}
        error={errors.email}
      />
      <Input
        placeholder="Введите пароль"
        name="password"
        type="password"
        value={formState.password}
        onChange={handleFieldChange}
        error={errors.password}
      />
      <button type="submit" disabled={isSubmitting || hasErrors}>
        {isSubmitting ? "Отправляем..." : "Отправить"}
      </button>
    </form>
  );
};
