class IncomesController < ApplicationController
  before_action :set_income, only: [ :edit, :update, :destroy ]
  before_action :normalization_params, only: [ :index, :create, :update ]

  def index
    if params[:q].present?
      @q = Income.current_user_session(1).ransack(params[:q])
    else
      @q = Income.current_user_session(1).current_month_year.ransack(params[:q])
    end

    @pagy, @incomes = pagy(@q.result, items: 5)
  end

  def new
    @income = Income.new
  end


  def create
    @income = Income.new(income_params)

    respond_to do |format|
      if @income.save
        format.html { redirect_to incomes_path, notice: "Receita cadastrada com sucesso." }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @income.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @income.value = @income.value_decimal_to_float
  end

  def update
    respond_to do |format|
      if @income.update(income_params)
        format.html { redirect_to incomes_path, notice: "Receita atualizada com sucesso." }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @income.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @income.destroy
      redirect_to incomes_path, notice: "Receita excluída com sucesso."
    else
      redirect_to incomes_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
    end
  end

  private

  def normalization_params
    params[:income][:value] = convert_float_to_decimal(params[:income][:value]) if params[:income].present?
    params[:income][:date].gsub!(/\D/, '') if params[:income].present?
    params[:q][:date_cont_any].gsub!(/\D/, '') if params[:q].present?
  end

  def set_income
    @income = Income.find(params[:id])
  end

  def income_params
    params.require(:income).permit(:description, :value, :date).merge(user_id: 1)
  end
end