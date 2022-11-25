declare namespace API {
    export interface IEstimateInfo {
        prepay: string | number;
        total: string | number;
        total_sale?: string | number;
        sale_percent?: string | number;
        sale_available_to?: string | number;
    }

    export interface IOrder {
        order_id: number | string;
        user_id: number | string;
        hash: string;
        authtoken: string;
        estimate_info?: IEstimateInfo;
    }

    export interface IList {
        id: IGlobal.typeID;
        name: IGlobal.typeName;
    }

    export interface IWorkTypesList {
        list: IList[] | null;
        status: boolean;
    }

    export interface ICoursesList {
        list: IList[] | null;
        status: boolean;
    }

    export interface ICreateOrderFromBot {
        status: boolean;
        data: IOrder
    }

    export interface IEditOrderFromBot {
        status: boolean;
        data: any;
    }
}
