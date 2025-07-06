
import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const DateInput = ({ value, onChange, placeholder = "DD/MM/YYYY", className, id }: DateInputProps) => {
  const [displayValue, setDisplayValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const formatDateInput = (input: string) => {
    // Remove all non-numeric characters except existing slashes
    const digitsOnly = input.replace(/[^\d]/g, '');
    
    // Add slashes at appropriate positions
    let formatted = digitsOnly;
    if (digitsOnly.length >= 2) {
      formatted = digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2);
    }
    if (digitsOnly.length >= 4) {
      formatted = digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2, 4) + '/' + digitsOnly.substring(4, 8);
    }
    
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    // Allow backspace and delete to work naturally
    if (inputValue.length < displayValue.length) {
      setDisplayValue(inputValue);
      onChange(inputValue);
      return;
    }
    
    // Format the input
    const formatted = formatDateInput(inputValue);
    
    // Limit to DD/MM/YYYY format
    if (formatted.length <= 10) {
      setDisplayValue(formatted);
      onChange(formatted);
      
      // Adjust cursor position after formatting
      setTimeout(() => {
        if (inputRef.current) {
          let newPosition = cursorPosition;
          
          // If we just added a slash, move cursor after it
          if (formatted.length > inputValue.length && (formatted[cursorPosition] === '/')) {
            newPosition = cursorPosition + 1;
          }
          
          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const cursorPosition = e.currentTarget.selectionStart || 0;
    
    // Allow backspace to delete slashes
    if (e.key === 'Backspace') {
      if (displayValue[cursorPosition - 1] === '/' && cursorPosition > 0) {
        const newValue = displayValue.substring(0, cursorPosition - 1) + displayValue.substring(cursorPosition);
        setDisplayValue(newValue);
        onChange(newValue);
        e.preventDefault();
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
          }
        }, 0);
      }
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        maxLength={10}
      />
      <div className="absolute inset-0 pointer-events-none flex items-center px-3 text-gray-400 font-mono">
        <span className="opacity-0">
          {displayValue.padEnd(10, placeholder.substring(displayValue.length))}
        </span>
      </div>
    </div>
  );
};

export default DateInput;
