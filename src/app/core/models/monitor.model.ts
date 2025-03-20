export interface MonitorModel {
    id : number;
    user_id : number;
    Nombre_monitor:string;
    Nombre_Monitor:string | null;
    Ubicacion:string;
    Activo : number | null;
    deleted_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
