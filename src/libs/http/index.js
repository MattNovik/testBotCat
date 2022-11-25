import querystring from 'querystring';

export default {
    request(url, { ...params }) {
        // query = {}, 
        // ?${querystring.stringify(query)}
        return fetch(`${url}`, params)
            .then(response => {
                if (!response.ok) {
                    if (response.status >= 400 && response.status < 500) {
                        return response.json();
                    }

                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .then(response => {
                if (response.errors) {
                    if (typeof response.errors === 'string') {
                        throw new Error(response.errors);
                    }

                    if (
                        typeof response.errors === 'object' &&
                        Object.keys(response.errors).length > 0
                    ) {
                        const errors = {};

                        Object.keys(response.errors).map(key => {
                            errors[key] = response.errors[key].msg;
                        });

                        throw errors;
                    }
                }

                return response;
            });
    },
    get(url, { ...params }) {
        return this.request(url, params);
    },
    post(url, { ...params }) {
        const options = {
            method: 'POST',
            headers: new Headers(),
            body: '',
            ...params
        };

        if (params.files) {
            const files = params.files;

            options.body = new FormData();

            files.map((file) => options.body.append('files[]', file));

            if (params.data) {
                const data = params.data;

                Object.keys(data).forEach(key => options.body.append(key, data[key]));
            }
        } else if (params.data && params.data.isJSON) {
            options.headers.set('Content-Type', 'application/json; charset=utf-8');
            delete params.data.isJSON;

            options.body = JSON.stringify(params.data);
        } else if (params.data) {
            const data = params.data;

            options.headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

            if (typeof data === 'object') {
                options.body = Object.keys(data)
                    .map(key => {
                        if (Array.isArray(data[key])) {
                            return data[key]
                                .map(value => querystring.stringify({ [key]: value }))
                                .join('&');
                        }

                        return querystring.stringify({ [key]: data[key] });
                    })
                    .join('&');
            }

            if (typeof data === 'string') {
                options.body = data;
            }
        }

        return this.request(url, options);
    },
    put(url, { ...params }) {
        const options = {
            method: 'PUT',
            ...params
        };

        return this.post(url, options);
    },
    delete(url, { ...params }) {
        const options = {
            method: 'DELETE',
            ...params
        };

        if (!params.data) {
            return this.get(url, options);
        }

        return this.post(url, options);
    }
};
