import React, { Component } from 'react';

import './static/styles.scss';

interface IUploaderProps {
    name: string;
    placeholder?: string;
    /** Срабатывает при открытии */
    onChange?(name: string | undefined, value: any,  e: InputEvent): void;
}

class Uploader extends Component<IUploaderProps> {
    constructor(props: IUploaderProps) {
        super(props);

        this.state = {
            files: [],
        };
    }

    handleChange = (e: any) => {
        const { onChange } = this.props;
        const files = e.target.files;

        if(onChange) onChange(this.props.name, files, e);
    }

    render() {
        return (
            <label className='botcat-file-upload'>
                <input type='file' multiple onChange={this.handleChange} />
                {this.props.placeholder}
            </label>
        );
    }
}

export default Uploader;