import { useRef, useState } from 'react';
import { OFFER_SORT_OPTIONS, OfferSortProps, OfferSortValue } from './types';
import { useClickOutside } from '../../hooks/useClickOutside';

export const OfferSort = ({
  defaultValue = 'popular',
  onChange,
}: OfferSortProps) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [value, setValue] = useState<OfferSortValue>(defaultValue);

  const sortRef = useRef<HTMLDivElement>(null);

  const currentOption = OFFER_SORT_OPTIONS.find(
    (option) => option.value === value
  )!;

  const handleOptionChange = (nextValue: OfferSortValue) => {
    setValue(nextValue);
    onChange?.(nextValue);
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
          {OFFER_SORT_OPTIONS.map((option) => (
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
