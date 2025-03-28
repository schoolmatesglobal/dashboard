import React from 'react'

const Title = ({
    text,
    className,
    titleWrap = true,
    hasTwoTitleRows,
    children,
}) => {
    const baseStyle = {
        fontWeight: 'bold',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        color: '#15803d', // green-700 equivalent
        border: '0.5px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 5px', // py-1 px-[5px]
    }

    const conditionalStyles = {
        ...(titleWrap && { whiteSpace: 'pre-wrap' }),
        ...(hasTwoTitleRows && { height: '82px' }),
        ...(!text && { paddingTop: '0px', paddingBottom: '0px' }),
    }

    // Merge base styles with conditional styles and convert className to style object if provided
    const finalStyle = {
        ...baseStyle,
        ...conditionalStyles,
        ...(className && { className }), // Keep className compatibility if needed
    }

    return (
        <p style={finalStyle}>
            {children ? children : text}
        </p>
    )
}

export default Title