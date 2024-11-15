import { Steps } from "./types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";
import deepMerge from "lodash/merge";
import { PersonalFormValues } from "./_components/steps/personal";
import { PropertyFormValues } from "./_components/steps/property";
import { DocsFormValues } from "./_components/steps/docs";

export type ApplyFormStore = {
  steps: {
    current: Steps | null;
    completed: Steps[];
    nextFromCurrent: () => void;
    previousFromCurrent: () => void;
    goTo: (step: Steps) => void;
    complete: (step: Steps) => void;
    removeComplete: (step: Steps) => void;
    reset: () => void;
  };
  form: {
    data: {
      personal: Partial<PersonalFormValues> | null;
      property: Partial<PropertyFormValues> | null;
      docs: Partial<DocsFormValues> | null;
    };
    updatePersonal: (data: Partial<PersonalFormValues>) => void;
    updateProperty: (data: Partial<PropertyFormValues>) => void;
    updateDocs: (data: Partial<DocsFormValues>) => void;
  };
  validTo: Date | null | string;
  invalidate: (force?: boolean) => boolean;
  canInvalidate: boolean;
  forbidInvalidation: (option: boolean) => void;
  startValidTo: () => void;
  setValidToPast: () => void;
  isValidToExpired: () => boolean;
  _hydrated: boolean;
  _setHydrated: (hydrated: boolean) => void;
};

export const useApplyFormStore = create<ApplyFormStore>()(
  devtools(
    persist(
      (set, get) => ({
        form: {
          data: {
            personal: null,
            property: null,
            docs: null,
          },
          updatePersonal: (data) =>
            set(
              produce((state: ApplyFormStore) => {
                state.form.data.personal = {
                  ...state.form.data.personal,
                  ...data,
                };
              })
            ),
          updateProperty: (data) =>
            set(
              produce((state: ApplyFormStore) => {
                state.form.data.property = {
                  ...state.form.data.property,
                  ...data,
                };
              })
            ),
          updateDocs: (data) =>
            set(
              produce((state: ApplyFormStore) => {
                state.form.data.docs = {
                  ...state.form.data.docs,
                  ...data,
                };
              })
            ),
        },
        validTo: null,
        startValidTo: () =>
          set(
            produce((state: ApplyFormStore) => {
              if (state.validTo === null) {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                date.setHours(23, 59, 59, 999);

                state.validTo = date;
              }
            })
          ),
        setValidToPast: () =>
          set(
            produce((state: ApplyFormStore) => {
              if (state.validTo !== null) {
                state.validTo = new Date();
              }
            })
          ),
        invalidate: (force = false) => {
          const { isValidToExpired, steps, canInvalidate } = get();

          if ((force && canInvalidate) || isValidToExpired()) {
            set(
              produce((state: ApplyFormStore) => {
                state.validTo = null;
                state.form.data = {
                  personal: null,
                  property: null,
                  docs: null,
                };
              })
            );

            steps.reset();

            return true;
          }

          return false;
        },
        canInvalidate: true,
        forbidInvalidation: (option) => {
          set(
            produce((state: ApplyFormStore) => {
              state.canInvalidate = !option;
            })
          );
        },
        isValidToExpired: () => {
          const validTo = get().validTo;

          const now = new Date();

          if (validTo !== null) {
            return now > new Date(validTo);
          }

          return false;
        },
        steps: {
          current: null,
          completed: [],
          nextFromCurrent: () => {
            const steps = Object.values(Steps);

            const {
              steps: { current },
            } = get();

            if (current === null) {
              set(
                produce((state: ApplyFormStore) => {
                  state.steps.current = steps[0];
                })
              );
              return;
            }

            const currentStepIndex = steps.indexOf(current);
            const nextStepIndex = Math.min(
              currentStepIndex + 1,
              steps.length - 1
            );

            set(
              produce((state) => {
                state.steps.current = steps[nextStepIndex];
              })
            );
          },
          previousFromCurrent: () => {
            const steps = Object.values(Steps);

            const {
              steps: { current },
            } = get();

            if (current === null) {
              return;
            }

            const currentStepIndex = steps.indexOf(current);
            const previousStepIndex = Math.max(currentStepIndex - 1, 0);

            set(
              produce((state: ApplyFormStore) => {
                state.steps.current = steps[previousStepIndex];
              })
            );
          },
          goTo: (step) =>
            set(
              produce((state: ApplyFormStore) => {
                state.steps.current = step;
              })
            ),
          complete: (step) =>
            set(
              produce((state: ApplyFormStore) => {
                if (!state.steps.completed.includes(step)) {
                  state.steps.completed.push(step);
                }
              })
            ),
          removeComplete: (step) =>
            set(
              produce((state: ApplyFormStore) => {
                state.steps.completed = state.steps.completed.filter(
                  (v) => v !== step
                );
              })
            ),
          reset: () =>
            set(
              produce((state: ApplyFormStore) => {
                state.steps.current = null;
                state.steps.completed = [];
              })
            ),
        },
        _hydrated: false,
        _setHydrated: (hydrated) =>
          set(
            produce((state: ApplyFormStore) => {
              state._hydrated = hydrated;
            })
          ),
      }),
      {
        name: "apply-form-draft",
        version: 0,
        onRehydrateStorage: () => (state) => {
          state?._setHydrated(true);
        },
        merge: (persisted, current) => {
          return deepMerge({}, current, persisted);
        },
        partialize: (state) => {
          const stateToPersisted = {
            ...state,
            form: { ...state.form, data: { ...state.form.data, docs: null } },
          };

          return stateToPersisted;
        },
      }
    )
  )
);
