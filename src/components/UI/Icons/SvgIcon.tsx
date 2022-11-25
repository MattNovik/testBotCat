import React, { ReactNode, CSSProperties, forwardRef } from 'react';
import classnames from 'classnames';

export interface ISvgIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
    /** Дочерний элемент */
    children?: ReactNode;
    /** Имена классов */
    className?: string;
    /** Выравнивание сверху */
    top?: boolean;
    /** Выравнивание по центру */
    middle?: boolean;
    /** Выравнивание снизу */
    bottom?: boolean;
    /** Ширина */
    width?: string | number;
    /** Высота */
    height?: string | number;
    /** Размер иконки
     *  - lxs: 18px
     *  - xs: 20px
     *  - sm: 30px
     *  - md: 40px
     *  - lg: 50px
     *  - exlg: 60px
     */
    size?: number | 'lxs' | 'xs' | 'sm' | 'md' | 'lg' | 'exlg' | '';
    /** ViewBox */
    viewBox?: string;
    /** Цвет обводки цвета текста */
    strokeColor?: boolean;
    /** Цвет заливки цвета текста */
    fillColor?: boolean;
}

const sizeArray = ['lxs', 'xs', 'sm', 'md', 'lg', 'exlg'];
const SvgIcon = forwardRef<SVGSVGElement, ISvgIconProps>((props, ref) => {
    const { children, className: classNameProp, top, middle, bottom, viewBox, size, fillColor = true, strokeColor, ...otherProps } = props;

    const style: CSSProperties = {
        ...otherProps.style,
        fontSize: sizeArray.includes(String(size)) ? undefined : size
    };
    const className = classnames(
        'svg-icon',
        {
            [`svg-icon_${size}`]: sizeArray.includes(String(size)) && size,
            'svg-icon_top': top,
            'svg-icon_middle': middle,
            'svg-icon_bottom': bottom,
            'svg-icon_stroke-cc': strokeColor,
            'svg-icon_fill-cc': fillColor
        },
        classNameProp
    );

    return (
        <svg
            className={className}
            focusable='false'
            viewBox={viewBox}
            aria-hidden='true'
            role='presentation'
            {...otherProps}
            ref={ref}
            style={Object.keys(style).length ? style : undefined}
        >
            {children}
        </svg>
    );
});

SvgIcon.defaultProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 20 20',
    size: 'xs'
};

export default SvgIcon;
