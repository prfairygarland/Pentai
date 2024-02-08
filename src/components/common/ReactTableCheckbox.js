import React from 'react';

export const ReactTableCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div className='no-label-check'>
        <input
          className='form-check-input campaigncheckid'
          type='checkbox'
          ref={resolvedRef}
          {...rest}
        />
      </div>
    );
  },
);
