import BanerModule from "@/components/BanerModule";
import { ButtonPrimary } from "@/components/Buttons";
import { InputPrimary } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import { verifUser } from "@/helpers/verifUser";
import { useConfiguration } from "@/hooks/calculator/useConfiguration";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
export async function getServerSideProps(context) {
  return await verifUser(context, "/calculator/configuration-pay");
}
export default function ConfigurationPay({ dataRoles, dataUser, dataModules }) {
  const { data, handleChangeData, handleSubmit } = useConfiguration();
  return (
    <LoyoutIntranet
      title="Calculo - configuración"
      description="Configuración de los calculos"
      user={dataUser}
      modules={dataModules}
      roles={dataRoles}
    >
      <BanerModule
        imageBanner="/baners/Group 11.jpg"
        title="Calculo - configuración"
      />
      <form
        id="form-quotation"
        className="w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-2"
        onSubmit={handleSubmit}
      >
        <div className="col-span-full border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-1 text-blue-600">
            Costos por hora de trabajo
          </h2>
          <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            <div className="col-span-6 lg:col-span-4 xl:col-span-3">
              <InputPrimary
                type="number"
                name="calculator_price_supervition"
                label="Costos por hora de supervicion"
                onChange={handleChangeData}
                step="0.01"
                value={data.calculator_price_supervition}
                inputRequired="required"
              />
            </div>
            <div className="col-span-6 lg:col-span-4 xl:col-span-3">
              <InputPrimary
                type="number"
                value={data.calculator_price_opertor}
                name="calculator_price_opertor"
                onChange={handleChangeData}
                step="0.01"
                label="Costos por hora de operario"
                inputRequired="required"
              />
            </div>
            <div className="col-span-6 lg:col-span-4 xl:col-span-3">
              <InputPrimary
                type="number"
                name="calculator_price_supervition_extra"
                label="Costos por hora extra supervición"
                onChange={handleChangeData}
                step="0.01"
                value={data.calculator_price_supervition_extra}
                inputRequired="required"
              />
            </div>
            <div className="col-span-6 lg:col-span-4 xl:col-span-3">
              <InputPrimary
                type="number"
                value={data.calculator_price_opertor_extra}
                name="calculator_price_opertor_extra"
                onChange={handleChangeData}
                step="0.01"
                label="Costos por hora extra operarion"
                inputRequired="required"
              />
            </div>
          </div>
        </div>
        <div className="col-span-full border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-1 text-blue-600">
            Horas y Margenes
          </h2>
          <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            <div className="col-span-6 lg:col-span-3">
              <InputPrimary
                type="number"
                onChange={handleChangeData}
                value={data.calculator_price_hour_daily}
                name="calculator_price_hour_daily"
                label="Horas efectivas por día"
                inputRequired="required"
              />
            </div>
            <div className="col-span-6 lg:col-span-4">
              <InputPrimary
                type="number"
                onChange={handleChangeData}
                step="0.01"
                value={data.calculator_price_operating_margin}
                name="calculator_price_operating_margin"
                label="Margen operarivo deseable (%)"
                inputRequired="required"
              />
            </div>
          </div>
        </div>
        <div className="col-span-full border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-1 text-blue-600">
            Costos adicionales
          </h2>
          <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            <div className="col-span-6 lg:col-span-3">
              <InputPrimary
                type="number"
                onChange={handleChangeData}
                step="0.01"
                value={data.calculator_price_km_desplacement}
                name="calculator_price_km_desplacement"
                label="Costo por km desplazamiento"
                inputRequired="required"
              />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <InputPrimary
                type="number"
                onChange={handleChangeData}
                step="0.01"
                value={data.calculator_price_site_visit}
                name="calculator_price_site_visit"
                label="Costo por visita a obra"
                inputRequired="required"
              />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <InputPrimary
                type="number"
                onChange={handleChangeData}
                step="0.01"
                value={data.calculator_price_overnight_voucher}
                name="calculator_price_overnight_voucher"
                label="Bono por pernoctar"
                inputRequired="required"
              />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <InputPrimary
                type="number"
                onChange={handleChangeData}
                step="0.01"
                value={data.calculator_price_food_diary}
                name="calculator_price_food_diary"
                label="Costo diario de alimentación"
                inputRequired="required"
              />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <InputPrimary
                type="number"
                onChange={handleChangeData}
                step="0.01"
                value={data.calculator_price_medical_exam}
                name="calculator_price_medical_exam"
                label="Gasto examen médico"
                inputRequired="required"
              />
            </div>
          </div>
        </div>
        <div className="my-2">
          <ButtonPrimary
            type="submit"
            text="Guardar"
            icon={<ClipboardDocumentIcon className="size-6" />}
          />
        </div>
      </form>
    </LoyoutIntranet>
  );
}
