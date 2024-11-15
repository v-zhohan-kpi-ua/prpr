import { useTranslations } from "next-intl";
import Combobox, { ComboboxProps } from "@prpr/ui/components/combobox";

export type ComboboxWithI18nProps = ComboboxProps;

export default function ComboboxWithI18n(props: ComboboxWithI18nProps) {
  const t = useTranslations("common.components.combobox");

  const {
    emptyMessage = t("noOptions"),
    errorMessage = t("errors.general"),
    placeholder = t("placeholder"),
    loadingMessage = t("loading"),
    ...otherProps
  } = props;

  return (
    <Combobox
      emptyMessage={emptyMessage}
      errorMessage={errorMessage}
      placeholder={placeholder}
      loadingMessage={loadingMessage}
      {...otherProps}
    />
  );
}
