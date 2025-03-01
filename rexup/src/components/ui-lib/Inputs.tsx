// Is a predefined input element that can hold a boolean that indicates invalidInputs
// through TailwindCSS classes.

type Props = {
  placeholder?: string;
  invalidInputs?: boolean;
  value: string;
  defaultValue?: string;
  type?: "text" | "number";
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Inputs(props: Props) {
  return (
    <input
      placeholder={props.placeholder}
      inputMode={props.type === "number" ? "numeric" : "text"}
      spellCheck={false}
      // type={props.type ? props.type : 'text'}
      className={`w-[400px] rounded-md bg-gray-800 outline-gray-800 focus-visible:outline-none px-3 py-[2px] transition-[outline] ${
        props.invalidInputs ? "outline-red-700" : ""
      }`}
      value={props.value}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  );
}
