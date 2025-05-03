import { parseMoney } from "@/helpers/utilities";
import Modal from "../Modal";

export default function CalculatorTotal({
  statusModal = "",
  handleCloseModal = () => {},
  data = {},
  formData = {},
}) {
  const hourWorkWorker =
    formData.calculator_price_num_day_building *
    data.calculator_price_hour_daily *
    formData.calculator_price_num_workers *
    data.calculator_price_opertor;
  const extraWorkWorder = !formData.calculator_included_hours_extra_worker
    ? 0
    : formData.calculator_price_hours_extra_worker *
      formData.calculator_price_num_day_building *
      formData.calculator_price_num_workers *
      data.calculator_price_opertor_extra;
  const totalPeople =
    formData.calculator_price_num_workers +
    formData.calculator_price_num_supervisor;

  const hourSupervisor =
    formData.calculator_price_num_day_building *
    data.calculator_price_hour_daily *
    formData.calculator_price_num_supervisor *
    data.calculator_price_supervition;
  const extraSupervisor = !formData.calculator_included_hours_extra_supervition
    ? 0
    : formData.calculator_price_hours_extra_supervition *
      formData.calculator_price_num_day_building *
      formData.calculator_price_num_supervisor *
      data.calculator_price_supervition_extra;
  const foodTotal = !formData.calculator_included_food
    ? 0
    : totalPeople *
      formData.calculator_price_num_day_building *
      data.calculator_price_food_diary;
  const visitTotal = !formData.calculator_included_visit_site
    ? 0
    : data.calculator_price_site_visit * formData.calculator_num_visit_site;
  const pernoctarTotal =
    data.calculator_price_overnight_voucher *
    formData.calculator_price_num_day_building *
    totalPeople;
  const medicalExamTotal = !formData.calculator_included_exam_medical
    ? 0
    : data.calculator_price_medical_exam * totalPeople;
  const payHouse = !formData.calculator_included_pernoctar
    ? 0 : data.calculator_price_pay_pernoctar * formData.calculator_price_num_day_building * formData.calculator_price_num_workers;
  const desplazamientoTotal = !formData.calculator_included_pernoctar
    ? formData.calculator_km_desplacement *
      formData.calculator_price_num_day_building *
      data.calculator_price_km_desplacement
    : formData.calculator_km_desplacement *
      data.calculator_price_km_desplacement;
  const subtotal =
    hourWorkWorker +
    extraWorkWorder +
    hourSupervisor +
    extraSupervisor +
    foodTotal +
    visitTotal +
    pernoctarTotal +
    medicalExamTotal +
    desplazamientoTotal;
  const margenOperative =
    subtotal / (1 - data.calculator_price_operating_margin / 100);
  return (
    <Modal
      status={statusModal}
      title="Calculo de instalación"
      onSave={null}
      handleCloseModal={handleCloseModal}
    >
      <div className="grid grid-cols-12 gap-x-3 gap-y-0">
        <div className="col-span-8">
          <span className="text-base font-medium text-gray-700 mb-2">
            Mano de obra operarios
          </span>
        </div>
        <div className="col-span-4">
          <span className="text-gray-600">
            {parseMoney(hourWorkWorker + extraWorkWorder, "PEN")}
          </span>
        </div>
        <div className="col-span-8">
          <span className="text-base font-medium text-gray-700 mb-2">
            Mano de obra supervisores
          </span>
        </div>
        <div className="col-span-4">
          <span className="text-gray-600">
            {parseMoney(hourSupervisor + extraSupervisor, "PEN")}
          </span>
        </div>
        <div className="col-span-8">
          <span className="text-base font-medium text-gray-700 mb-2">
            Alimentación
          </span>
        </div>
        <div className="col-span-4">
          <span className="text-gray-600">{parseMoney(foodTotal, "PEN")}</span>
        </div>
        <div className="col-span-8">
          <span className="text-base font-medium text-gray-700 mb-2">
            Visitas a obra
          </span>
        </div>
        <div className="col-span-4">
          <span className="text-gray-600">{parseMoney(visitTotal, "PEN")}</span>
        </div>
        <div className="col-span-8">
          <span className="text-base font-medium text-gray-700 mb-2">
            Pernocta
          </span>
        </div>
        <div className="col-span-4">
          <span className="text-gray-600">
            {parseMoney(pernoctarTotal, "PEN")}
          </span>
        </div>
        {formData.calculator_included_pernoctar && (
          <>
            <div className="col-span-8">
              <span className="text-base font-medium text-gray-700 mb-2">
                Gastos de hospedaje
              </span>
            </div>
            <div className="col-span-4">
              <span className="text-gray-600">
                {parseMoney(payHouse, "PEN")}
              </span>
            </div>
          </>
        )}

        <div className="col-span-8">
          <span className="text-base font-medium text-gray-700 mb-2">
            Exámenes médicos
          </span>
        </div>
        <div className="col-span-4">
          <span className="text-gray-600">
            {parseMoney(medicalExamTotal, "PEN")}
          </span>
        </div>
        <div className="col-span-8">
          <span className="text-base font-medium text-gray-700 mb-2">
            Desplazamiento
          </span>
        </div>
        <div className="col-span-4">
          <span className="text-gray-600">
            {parseMoney(desplazamientoTotal, "PEN")}
          </span>
        </div>
        <div className="col-span-8 border-b-2 mb-2">
          <span className="text-base font-medium text-gray-700 mb-2">
            Subtotal sin margen
          </span>
        </div>
        <div className="col-span-4 border-b-2 mb-2">
          <span className="text-gray-600">{parseMoney(subtotal, "PEN")}</span>
        </div>
        <div className="col-span-8">
          <span className="text-lg font-semibold text-gray-700 mb-2">
            Total con margen ({data.calculator_price_operating_margin}%)
          </span>
        </div>
        <div className="col-span-4">
          <span className="text-xl font-bold text-gray-600">
            {parseMoney(margenOperative, "PEN")}
          </span>
        </div>
      </div>
    </Modal>
  );
}
