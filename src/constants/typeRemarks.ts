import colors from "../assets/theme/colors";

export function typeRemarks(type:string) {
    if (type == 'paid_off_contract_amount') return {'text' : 'Lunas Contract Amount','color':colors.primary};
    if (type == 'paid_off_due_amount') return {'text' : 'Lunas Due Amount','color':colors.primary};
    if (type == 'promise_to_pay') return {'text' : 'Janji Bayar (Tidak Kooperatif)','color':colors.danger};
    if (type == 'promise_to_pay_cooperative') return {'text' : 'Janji Bayar (kooperatif)','color':colors.yellow};
    if (type == 'partial') return {'text' : 'Sebagian','color':colors.yellow};
    if (type == 'payment_relief') return  {'text' : 'Permintaan Keringanan','color':colors.yellow};
    if (type == 'failed_payment') return {'text' : 'Gagal Bayar','color':colors.danger};
}