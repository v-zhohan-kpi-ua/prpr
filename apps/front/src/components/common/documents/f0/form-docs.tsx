import { F0PropertiesFormDocs } from "@prpr/documents/properties";
import Typography from "@prpr/ui/components/typography";
import { cn } from "@prpr/ui/lib/utils";
import { useTranslations } from "next-intl";
import { ValuesType } from "utility-types";

export function F0FormDocs({
  docs,
  withHeader = false,
  headerClassName,
}: {
  docs: {
    id: (ValuesType<F0PropertiesFormDocs["id"]> & { url?: string })[];
    propertyId: (ValuesType<F0PropertiesFormDocs["propertyId"]> & {
      url?: string;
    })[];
    evidenceOfDamagedProperty?: (ValuesType<
      Required<F0PropertiesFormDocs>["evidenceOfDamagedProperty"]
    > & { url?: string })[];
  };
  withHeader?: boolean;
  headerClassName?: string;
}) {
  const t = useTranslations("common.documents.f0.form.docs");

  return (
    <div className="break-words">
      {withHeader && (
        <Typography
          variant="h4"
          className={cn("border-b mb-2", headerClassName)}
        >
          {t("header.title")}
        </Typography>
      )}

      {/* id */}
      <div className={cn("flex flex-col gap-1", withHeader && "ml-3")}>
        {docs.id.length > 0 && (
          <div>
            <div className="font-bold">{t("id")}:</div>
            <ul className="ml-6 list-decimal [&>li]:mt-1">
              {docs.id.map(({ key, description, url }) => (
                <li key={key}>
                  <div>
                    {t("location")}:{" "}
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {key}
                      </a>
                    ) : (
                      <span>
                        {key}{" "}
                        <span className="lowercase">
                          ({t("urlNotAvailable")})
                        </span>
                      </span>
                    )}
                  </div>
                  {description && (
                    <div>
                      {t("description")}: {description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* propertyId */}
        {docs.propertyId.length > 0 && (
          <div>
            <div className="font-bold">{t("propertyId")}:</div>
            <ul className="ml-6 list-decimal [&>li]:mt-1">
              {docs.propertyId.map(({ key, description, url }) => (
                <li key={key}>
                  <div>
                    {t("location")}:{" "}
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {key}
                      </a>
                    ) : (
                      <span>
                        {key}{" "}
                        <span className="lowercase">
                          ({t("urlNotAvailable")})
                        </span>
                      </span>
                    )}
                  </div>
                  {description && (
                    <div>
                      {t("description")}: {description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* evidenceOfDamagedProperty */}
        {docs.evidenceOfDamagedProperty &&
          docs.evidenceOfDamagedProperty?.length > 0 && (
            <div>
              <div className="font-bold">{t("evidenceOfDamagedProperty")}:</div>
              <ul className="ml-6 list-decimal [&>li]:mt-1">
                {docs.evidenceOfDamagedProperty.map(
                  ({ key, description, url }) => (
                    <li key={key}>
                      <div>
                        {t("location")}:{" "}
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {key}
                          </a>
                        ) : (
                          <span>
                            {key}{" "}
                            <span className="lowercase">
                              ({t("urlNotAvailable")})
                            </span>
                          </span>
                        )}
                      </div>
                      {description && (
                        <div>
                          {t("description")}: {description}
                        </div>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
