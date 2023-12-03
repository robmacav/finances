class RevenuesController < ApplicationController
  before_action :set_revenue, only: [ :edit, :update, :destroy ]
  before_action :normalization_params, only: [ :index, :create, :update ]

  def index
    if params[:q].present?
      @q = Revenue.current_user_session(current_user.id).ransack(params[:q])
    else
      @q = Revenue.current_user_session(current_user.id).current_month_year.ransack(params[:q])
    end

    @pagy, @revenues = pagy(@q.result, items: 5)
  end

  def new
    @revenue = Revenue.new
  end


  def create
    @revenue = Revenue.new(revenue_params)

    respond_to do |format|
      if @revenue.save
        format.html { redirect_to revenues_path, notice: "Receita cadastrada com sucesso." }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @revenue.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @revenue.value = @revenue.value_decimal_to_float
  end

  def update
    respond_to do |format|
      if @revenue.update(revenue_params)
        format.html { redirect_to revenues_path, notice: "Receita atualizada com sucesso." }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @revenue.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @revenue.destroy
      redirect_to revenues_path, notice: "Receita excluída com sucesso."
    else
      redirect_to revenues_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
    end
  end

  private

  def normalization_params
    params[:revenue][:value] = convert_float_to_decimal(params[:revenue][:value]) if params[:revenue].present?
    params[:revenue][:date].gsub!(/\D/, '') if params[:revenue].present?
    params[:q][:date_cont_any].gsub!(/\D/, '') if params[:q].present?
  end

  def set_revenue
    @revenue = Revenue.find(params[:id])
  end

  def revenue_params
    params.require(:revenue).permit(:description, :value, :date).merge(user_id: current_user.id)
  end
end
