import React from 'react'
import Title from './ResultTitle'
import Value from './ResultValue'

const Block = ({
    title,
    value,
    className,
    titleClassName,
    valueClassName,
    hasTwoTitleRows,
    hasTwoValueRows,
    titleWrap,
    valueWrap,
    children,
}) => {
    const baseStyle = {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
    }

    // Merge base styles with className if provided
    const finalStyle = {
        ...baseStyle,
        ...(className && { className }), // Keep className compatibility
    }

    // Inline style for Value component's line-clamp-1
    const valueStyle = {
        display: '-webkit-box',
        WebkitLineClamp: '1',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        ...(valueClassName && { className: valueClassName }),
    }

    return (
        <div style={finalStyle}>
            <Title
                text={title}
                className={titleClassName}
                hasTwoTitleRows={hasTwoTitleRows}
                titleWrap={titleWrap}
            >
                {children}
            </Title>
            <div style={{
                height: '30px',
                // padding: '10px 0px'
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center',
                // gap: '10px',
            }}>
                <Value
                    text={value}
                    className={valueStyle} // Pass style object instead of classNames
                    hasTwoValueRows={hasTwoValueRows}
                    valueWrap={valueWrap}
                />
            </div>
        </div>
    )
}

export default Block