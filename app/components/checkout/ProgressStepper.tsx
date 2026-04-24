'use client';

export type StepStatus = 'completed' | 'active' | 'pending';

interface Step {
  number: number;
  label: string;
  status: StepStatus;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressStepper({
  currentStep,
  steps,
}: ProgressStepperProps) {
  const stepData: Step[] = steps.map((label, index) => {
    const stepNum = index + 1;
    let status: StepStatus;

    if (stepNum < currentStep) {
      status = 'completed';
    } else if (stepNum === currentStep) {
      status = 'active';
    } else {
      status = 'pending';
    }

    return {
      number: stepNum,
      label,
      status,
    };
  });

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
      {stepData.map((step, index) => (
        <div key={step.number} className="flex items-center gap-4 md:gap-8">
          {/* Step Circle */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-all ${
                step.status === 'completed'
                  ? 'bg-indigo-600 text-white'
                  : step.status === 'active'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.status === 'completed' ? (
                <span className="material-symbols-outlined text-lg md:text-xl">
                  check
                </span>
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-xs md:text-sm font-medium text-center whitespace-nowrap ${
                step.status === 'active'
                  ? 'text-indigo-600 font-bold'
                  : step.status === 'completed'
                    ? 'text-indigo-600'
                    : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < stepData.length - 1 && (
            <div
              className={`w-12 md:w-16 h-0.5 transition-all ${
                stepData[index + 1].status === 'completed' ||
                stepData[index + 1].status === 'active'
                  ? 'bg-indigo-600'
                  : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
