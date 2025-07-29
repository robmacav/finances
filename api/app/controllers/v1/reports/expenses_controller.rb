require 'ostruct'

class V1::Reports::ExpensesController < ApplicationController
    def by_category_and_month_year
        result = Category.all.each_with_object({}) do |category, hash|
            total = Expense.where("category_id = #{category.id} AND date like '%#{params[:month_year]}'").sum(:value)
            hash[category.summary] = total
        end

        render json: result
    end

    def all_by_month_year
        @expenses = Expense.all_by_month_year(params[:month_year])
        @expenses_kaminari = @expenses.page(params[:page]).per(params[:per_page] || 50)

        render json: {
            current_page: @expenses_kaminari.current_page,
            total_pages: @expenses_kaminari.total_pages,
            total_count: @expenses_kaminari.total_count,
            expenses: @expenses.map { |e| serialize_expense(e) }
        }
    end

    def all_by_month_year_by_category
        @expenses = Expense.all_by_month_year_by_category(params[:month_year]).page(params[:page]).per(params[:per_page] || 50)

        resultado = @expenses.map do |expense|
            {
                category: {
                    summary: expense.category.summary,
                    color: expense.category.color
                },
                total: expense.total.to_f
            }
        end
        
        render json: resultado
    end

    def current_year_total_months
        dados = Expense.current_year_total_months

        # Cria hash { "MMYYYY" => total }
        dados_hash = dados.index_by(&:month_year)

        # Meses abreviados em português
        meses = %w[Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez]

        # Ano atual
        ano = Time.current.year

        # Garante os 12 meses, preenchendo com 0.0 se não tiver dados
        resultado = (1..12).map do |mes|
            chave = format('%02d%04d', mes, ano) # exemplo: "012025"

            {
                name: meses[mes - 1],
                total: dados_hash[chave]&.total.to_f
            }
        end

        render json: resultado
    end

    def all_current_week
        render json: Expense.all_current_week_total_by_day.map{|e| { day: e.day_name.strip, total: e.total.to_f }}
    end

    def most_frequents_by_month_year
        render json: Expense.most_frequents_on_current_month(params[:month_year]).map { |e| { summary: e.summary, qtd: e.qtd.to_i, total: e.total.to_f } }
    end

    private

    def serialize_expense(expense)
        date = Date.strptime(expense.date, "%d%m%Y") rescue nil

        {
            id: expense.id,
            summary: expense.summary,
            details: expense.details,
            value: "R$ #{'%.2f' % expense.value}",

            date: date && {
            full: date.strftime("%d/%m/%Y"),
            day: date.day,
            month: date.month,
            year: date.year
            },

            status: {
            id: expense.status&.id,
            summary: expense.status&.summary
            },

            category: {
            id: expense.category&.id,
            summary: expense.category&.summary,
            color: expense.category&.color
            }
        }
        end
end