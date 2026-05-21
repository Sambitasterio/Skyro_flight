import type { BookingStep } from "@/types/flight";

const STEPS: { step: BookingStep; label: string }[] = [
  { step: 1, label: "Search" },
  { step: 2, label: "Select seat" },
  { step: 3, label: "Passenger" },
  { step: 4, label: "Confirm" },
];

interface BookingProgressProps {
  currentStep: BookingStep;
}

export function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {STEPS.map(({ step, label }, index) => {
          const done = step < currentStep;
          const active = step === currentStep;
          return (
            <li
              key={step}
              className="flex min-w-0 flex-1 flex-col items-center text-center"
            >
              <div className="flex w-full items-center">
                {index > 0 ? (
                  <span
                    className={`h-0.5 flex-1 ${done || active ? "bg-primary" : "bg-border"}`}
                    aria-hidden
                  />
                ) : (
                  <span className="flex-1" aria-hidden />
                )}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 sm:text-sm ${
                    active
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                      : done
                        ? "bg-primary/80 text-primary-foreground"
                        : "border border-border bg-card text-muted"
                  }`}
                >
                  {done ? "✓" : step}
                </span>
                {index < STEPS.length - 1 ? (
                  <span
                    className={`h-0.5 flex-1 ${done ? "bg-primary" : "bg-border"}`}
                    aria-hidden
                  />
                ) : (
                  <span className="flex-1" aria-hidden />
                )}
              </div>
              <span
                className={`mt-1.5 hidden text-xs font-medium sm:block ${
                  active ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-center text-sm font-medium text-foreground sm:hidden">
        Step {currentStep} of 4 — {STEPS.find((s) => s.step === currentStep)?.label}
      </p>
    </nav>
  );
}
