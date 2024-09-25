import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

interface AltchaProps {
  onValueChange: (val: null | string) => void;
}

const Altcha = forwardRef<{ value: string | null }, AltchaProps>(
  ({ onValueChange }, ref) => {
    const widgetRef = useRef<HTMLElement>(null);
    const [value, setValue] = useState<string | null>(null);

    useImperativeHandle(ref, () => {
      return {
        get value() {
          return value;
        },
      };
    }, [value]);

    useEffect(() => {
      const handleStateChange = (ev: Event | CustomEvent) => {
        if ("detail" in ev) {
          setValue(ev.detail.payload || null);
          onValueChange(ev.detail.payload || null);
        }
      };

      const { current } = widgetRef;

      if (current) {
        current.addEventListener("statechange", handleStateChange);
        return () =>
          current.removeEventListener("statechange", handleStateChange);
      }
    }, [onValueChange]);

    /* Configure your `challengeurl` and remove the `test` attribute, see docs: https://altcha.org/docs/website-integration/#using-altcha-widget  */
    return (
      <altcha-widget
        ref={widgetRef}
        style={{
          "--altcha-max-width": "100%",
        }}
        challengeurl={import.meta.env.PUBLIC_STOATI_URL + "challenges"}
      ></altcha-widget>
    );
  }
);

export default Altcha;
