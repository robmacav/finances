class CardsController < ApplicationController
  before_action :set_card, only: [ :update, :edit, :destroy ]
  before_action :normalization_params, only: [ :index, :create, :update ]

  def index
    @q = Card.ransack(params[:q])
    @pagy, @cards = pagy(@q.result, items: params[:per_page] || 5)
  end

  def new
    @card = Card.new
  end

  def create
    @card = Card.new(card_params)

    respond_to do |format|
      if @card.save
        format.html { redirect_to cards_path, notice: "Cartão cadastrado com sucesso." }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @card.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @card.limit = @card.limit_decimal_to_float
  end

  def update
    respond_to do |format|
      if @card.update(card_params)
        format.html { redirect_to cards_path, notice: "Cartão atualizado com sucesso." }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @card.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @card.destroy
      redirect_to cards_path, notice: "Cartão excluído com sucesso."
    else
      redirect_to cards_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
    end
  end

  private

  def normalization_params
    params[:card][:limit] = convert_float_to_decimal(params[:card][:limit]) if params[:card].present?
  end

  def set_card
    @card = Card.find(params[:id])
  end

  def card_params
    params.require(:card).permit(:description, :limit).merge(user_id: current_user.id)
  end
end
