import { useRef, useState, useCallback, useMemo } from "react";
import { Input } from "../Input";
import styles from "./SignUp.module.css";
import { getValidationErrors, objectHasElements } from "../../utils";
import { SignUpSchema, type SignUpErrors, type SignUpData } from "./model";
import { AtSign } from "lucide-react";

interface Props {
  onSubmit: (fields: SignUpData) => Promise<void>;
}

const DEFAULT_SIGN_IN_FIELDS = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  gender: null,
  nickName: "",
} as const;

export const SignUp = ({ onSubmit }: Props) => {
  const [formState, setFormState] = useState<SignUpData>(
    DEFAULT_SIGN_IN_FIELDS
  );
  const isSubmittedRef = useRef(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasErrors = useMemo(() => objectHasElements(errors), [errors]);

  const resetForm = useCallback(() => {
    setFormState(DEFAULT_SIGN_IN_FIELDS);
    setErrors({});
    isSubmittedRef.current = false;
  }, []);

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newState = { ...formState, [name]: value };
      setFormState(newState);

      if (isSubmittedRef.current) {
        setErrors(getValidationErrors(SignUpSchema, newState));
      }
    },
    [formState]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      isSubmittedRef.current = true;
      setIsSubmitting(true);

      const validationErrors = getValidationErrors(SignUpSchema, formState);
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
        placeholder="Введите имя"
        name="firstName"
        type="text"
        value={formState.firstName}
        onChange={handleFieldChange}
        error={errors.firstName}
      />

      <Input
        icon={<AtSign strokeWidth={1} size={20} />}
        placeholder="Введите ник"
        name="nickName"
        type="text"
        value={formState.nickName}
        onChange={handleFieldChange}
        error={errors.nickName}
      />

      <Input
        placeholder="Введите email"
        autoComplete="email"
        name="email"
        type="email"
        value={formState.email}
        onChange={handleFieldChange}
        error={errors.email}
      />

      <fieldset
        className={errors.gender ? styles.errorState : styles.gendersField}
      >
        <legend>Пол</legend>
        {["male", "female"].map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="gender"
              value={value}
              checked={formState.gender === value}
              onChange={handleFieldChange}
            />
            {value === "male"
              ? "Мужской"
              : value === "female"
              ? "Женский"
              : null}
          </label>
        ))}
        {errors.gender && <p className={styles.errorText}>{errors.gender}</p>}
      </fieldset>

      <Input
        placeholder="Введите пароль"
        name="password"
        type="password"
        value={formState.password}
        onChange={handleFieldChange}
        error={errors.password}
      />

      <Input
        placeholder="Повторите пароль"
        name="confirmPassword"
        type="password"
        value={formState.confirmPassword}
        onChange={handleFieldChange}
        error={errors.confirmPassword}
      />

      <button type="submit" disabled={isSubmitting || hasErrors}>
        {isSubmitting ? "Отправляем..." : "Отправить"}
      </button>
    </form>
  );
};
