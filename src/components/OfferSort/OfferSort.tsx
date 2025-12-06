import { useRef, useState } from 'react';
import { OfferSortProps } from './OfferSort.types';
import { useClickOutside } from '../../hooks/useClickOutside';

export const OfferSort = <T extends string>({
  options,
  value,
  onChange,
}: OfferSortProps<T>) => {
  const [opened, setOpened] = useState<boolean>(false);

  const sortRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((option) => option.value === value)!;

  const handleOptionChange = (nextValue: string) => {
    onChange?.(nextValue as T);
  };

  useClickOutside(sortRef, () => setOpened(false));

  return (
    <div
      ref={sortRef}
      className="places__sorting"
      onClick={() => setOpened(!opened)}
    >
      <span className="places__sorting-caption">Sort by</span>
      <span className="places__sorting-type" tabIndex={0}>
        {currentOption.label}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      {opened && (
        <ul className="places__options places__options--custom places__options--opened">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionChange(option.value)}
              className="places__option places__option--active"
              tabIndex={0}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
