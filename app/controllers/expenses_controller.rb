class ExpensesController < ApplicationController
    before_action :set_expense, only: [ :show, :update, :edit, :destroy ]
    before_action :normalization_params, only: [ :index, :create, :update ]
  
    def index
      if params[:q].present?
        @q = Expense.all_by_current_user(current_user).ransack(params[:q])
      else
        @q = Expense.all_by_current_user(current_user).all_by_current_month_year.ransack(params[:q])
      end

      @pagy, @expenses = pagy(@q.result, items: 5)
      @categories = ExpenseCategory.all.map{|c| [c.description, c.id]}
    end
  
    def show
    end
  
    def new
      @expense = Expense.new
      @expense.items.build

      @cards = Card.all_by_current_user(current_user).map{|card| [card.description, card.id]}
      @tags = Tag.all_by_current_user(current_user).map{|t| [t.description, t.id]}
    end
  
    def create
      @expense = Expense.new(expense_params)
  
      respond_to do |format|
        if @expense.save
          format.html { redirect_to expenses_path, notice: "Despesa cadastrada com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @expense.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def edit
      @expense.items.build if @expense.items.blank?
  
      @expense.items.each do |item|
        item.value = item.value_decimal_to_float
      end

      @cards = Card.all_by_current_user(current_user).map{|card| [card.description, card.id]}
      @tags = Tag.all_by_current_user(current_user).map{|t| [t.description, t.id]}
    end
  
    def update
      respond_to do |format|
        if @expense.update(expense_params)
          format.html { redirect_to expenses_path, notice: "Despesa atualizada com sucesso." }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @expense.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def destroy
      if @expense.destroy
        redirect_to expenses_path, notice: "Despesa excluída com sucesso."
      else
        redirect_to expenses_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
      end
    end
  
    private
  
    def normalization_params
      params[:q][:date_cont_any].gsub!(/\D/, '') if params[:q].present?

      if params[:expense].present?
        params[:expense][:date].gsub!(/\D/, '') 

        params[:expense][:items_attributes].each do |item|
          item[1]["value"] = convert_float_to_decimal(item[1]["value"])
        end
      end
    end
  
    def set_expense
      @expense = Expense.find(params[:id])
    end
  
    def expense_params
      params.require(:expense).permit(:description, :expense_category_id, :tag_id, :date, :payment_method, :card_id, items_attributes: [ :id, :quantity, :description, :value, :_destroy ]).merge(user_id: current_user.id)
    end
  end
  