import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class FormatText extends PureComponent {
    static propTypes = {
        /**
         * Формат преобразования
         *  number - разделение разрядов числа пробелами
         *  area - возможна запись только [0-9/(?.,+)], то есть числа с десятичными значениями после точки
         *  phone - форматирование номера телефона формата +79213456789 в формат +7(921)345-67-89
         */
        format: PropTypes.string,
        /** Значение для преобразования */
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** Произвольное свойство дочернего элемента для преобразования
         * используется, если надо форматировать по одному шаблону данные в нескольких блоках
         * */
        param: PropTypes.string
    };

    static defaultProps = {
        format: ''
    };

    formating(value) {
        const string = String(value);
        let result = '';

        switch (this.props.format) {
            case 'number': {
                result = Math.floor(string.replace(/\s/g, ''));
                result = String(result)
                    .replace(/\D/g, '')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

                break;
            }
            case 'area': {
                result = string.replace(/[^0-9/(?.,+)]/g, '').replace(',', '.');

                break;
            }
            case 'phone': {
                let text = string;

                const parts = /^\+(\d)?(\d{1,3})?(\d{1,3})?(\d{1,2})?(\d{1,2})?/.exec(text);

                if (parts) {
                    if (parts[1]) text = `+${parts[1]} `;
                    if (parts[2]) text += `(${parts[2]}) `;
                    if (parts[3]) text += `${parts[3]}`;
                    if (parts[4]) text += `-${parts[4]}`;
                    if (parts[5]) text += `-${parts[5]}`;
                }

                result = text;

                break;
            }
            default: {
                result = string;

                break;
            }
        }

        return result;
    }

    render() {
        let children;

        if (this.props.value === undefined && this.props.param) {
            children = React.Children.map(this.props.children, child =>
                React.cloneElement(child, {
                    [this.props.param]: this.formating(child.props[this.props.param])
                })
            );
        } else {
            children = this.formating(this.props.value);
        }

        return <span>{children}</span>;
    }
}

export default FormatText;
