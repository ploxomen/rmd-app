import BanerModule from "@/components/BanerModule";
import { ButtonPrimary } from "@/components/Buttons";
import CalculatorTotal from "@/components/calculator/CalculatorTotal";
import { InputOnly, InputPrimary, Toogle } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import { verifUser } from "@/helpers/verifUser";
import { useConfiguration } from "@/hooks/calculator/useConfiguration";
import { CalculatorIcon } from "@heroicons/react/24/solid";
export async function getServerSideProps(context) {
  return await verifUser(context, "/calculator/pay");
}
export default function CalculatorPay({ dataRoles, dataUser, dataModules }) {
  const {
    data,
    formData,
    handleChangeFormData,
    modal,
    handleChangeData,
    handleOpenModal,
    handleCloseModal,
    handleChangeFormDataToogle,
  } = useConfiguration();
  return (
    <>
      <LoyoutIntranet
        title="Calculo de instalación"
        description="Calculos de instalación"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 11.jpg"
          title="Calculo de instalación"
        />
        <form
          id="form-quotation"
          className="w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleOpenModal();
          }}
        >
          <div className="col-span-full border rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-1 text-blue-600">
              Datos generales
            </h2>
            <div className="grid grid-cols-12 gap-x-4 gap-y-2">
              <div className="col-span-6 lg:col-span-3">
                <InputPrimary
                  type="number"
                  name="calculator_price_num_workers"
                  label="N° de operarios"
                  onChange={handleChangeFormData}
                  value={formData.calculator_price_num_workers}
                  inputRequired="required"
                />
              </div>
              <div className="col-span-6 lg:col-span-3">
                <InputPrimary
                  type="number"
                  value={formData.calculator_price_num_supervisor}
                  name="calculator_price_num_supervisor"
                  onChange={handleChangeFormData}
                  label="N° de supervisores"
                  inputRequired="required"
                />
              </div>
              <div className="col-span-6 lg:col-span-3">
                <InputPrimary
                  type="number"
                  value={formData.calculator_price_num_day_building}
                  name="calculator_price_num_day_building"
                  onChange={handleChangeFormData}
                  label="N° días de trabajo"
                  inputRequired="required"
                />
              </div>
              <div className="col-span-6 lg:col-span-3">
                <InputPrimary
                  type="number"
                  value={data.calculator_price_operating_margin}
                  name="calculator_price_operating_margin"
                  onChange={handleChangeData}
                  label="Margen operativo (%)"
                  inputRequired="required"
                />
              </div>
              <div className="col-span-6 lg:col-span-3">
                <InputPrimary
                  type="number"
                  step="0.01"
                  value={formData.calculator_km_desplacement}
                  name="calculator_km_desplacement"
                  onChange={handleChangeFormData}
                  label="Km de ida y vuelta"
                />
              </div>
            </div>
          </div>
          <div className="col-span-12 border rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-1 text-blue-600">
              Condiciones de trabajo
            </h2>
            <div className="grid grid-cols-12 gap-x-4 gap-y-2">
              <div className="col-span-6">
                <div className="flex gap-2 items-center">
                  <div className="min-w-80">
                    <Toogle
                      text="¿Incluye horas extras de operarios?"
                      onChange={handleChangeFormDataToogle}
                      checked={formData.calculator_included_hours_extra_worker}
                      name="calculator_included_hours_extra_worker"
                    />
                  </div>

                  {formData.calculator_included_hours_extra_worker && (
                    <InputOnly
                      type="number"
                      name="calculator_price_hours_extra_worker"
                      label="Costo por hora extra"
                      onChange={handleChangeFormData}
                      value={formData.calculator_price_hours_extra_worker}
                      inputRequired="required"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-6">
                <div className="flex gap-2 items-center">
                  <div className="min-w-80">
                    <Toogle
                      text="¿Incluye horas extras de supervisores?"
                      onChange={handleChangeFormDataToogle}
                      checked={
                        formData.calculator_included_hours_extra_supervition
                      }
                      name="calculator_included_hours_extra_supervition"
                    />
                  </div>
                  {formData.calculator_included_hours_extra_supervition && (
                    <InputOnly
                      type="number"
                      name="calculator_price_hours_extra_supervition"
                      label="Costo por hora extra"
                      onChange={handleChangeFormData}
                      value={formData.calculator_price_hours_extra_supervition}
                      inputRequired="required"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-6">
                <div className="flex gap-2 items-center">
                  <div className="min-w-80">
                    <Toogle
                      text="¿Incluye visitas de obra?"
                      onChange={handleChangeFormDataToogle}
                      checked={formData.calculator_included_visit_site}
                      name="calculator_included_visit_site"
                    />
                  </div>
                  {formData.calculator_included_visit_site && (
                    <InputOnly
                      type="number"
                      name="calculator_num_visit_site"
                      label="Costo por hora extra"
                      onChange={handleChangeFormData}
                      value={formData.calculator_num_visit_site}
                      inputRequired="required"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-6">
                <Toogle
                  text="¿Se incluyen exámenes médicos?"
                  onChange={handleChangeFormDataToogle}
                  checked={formData.calculator_included_exam_medical}
                  name="calculator_included_exam_medical"
                />
              </div>
              <div className="col-span-6">
                <Toogle
                  text="¿Se requiere alimentación?"
                  onChange={handleChangeFormDataToogle}
                  checked={formData.calculator_included_food}
                  name="calculator_included_food"
                />
              </div>
              <div className="col-span-6">
                <Toogle
                  text="¿Hay pernocta fuera de casa?"
                  onChange={handleChangeFormDataToogle}
                  checked={formData.calculator_included_pernoctar}
                  name="calculator_included_pernoctar"
                />
              </div>
            </div>
          </div>
          <div className="my-2">
            <ButtonPrimary
              type="submit"
              text="Calcular"
              icon={<CalculatorIcon className="size-6" />}
            />
          </div>
        </form>
      </LoyoutIntranet>
      <CalculatorTotal
        statusModal={modal}
        data={data}
        formData={formData}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
