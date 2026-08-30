
import pytest
from engines.financial.loan import calculate_loan_structure, check_capital_sufficiency
from engines.financial.exceptions import InvalidFinancialInput


def test_calculate_loan_structure_normal():
    result = calculate_loan_structure(project_cost=1000000, margin_pct=0.10)
    assert result["margin_amount"] == 100000
    assert result["loan_amount"] == 900000
    assert result["project_cost"] == 1000000


def test_calculate_loan_structure_default_margin():
    result = calculate_loan_structure(project_cost=140000)  # default 10%
    assert result["margin_amount"] == 14000
    assert result["loan_amount"] == 126000


def test_calculate_loan_structure_zero_cost_invalid():
    with pytest.raises(InvalidFinancialInput):
        calculate_loan_structure(project_cost=0)


def test_calculate_loan_structure_negative_cost_invalid():
    with pytest.raises(InvalidFinancialInput):
        calculate_loan_structure(project_cost=-50000)


def test_calculate_loan_structure_invalid_margin_pct():
    with pytest.raises(InvalidFinancialInput):
        calculate_loan_structure(project_cost=100000, margin_pct=1.0)  # 100% margin, degenerate


def test_check_capital_sufficiency_sufficient():
    result = check_capital_sufficiency(available_capital=100000, required_margin=100000)
    assert result["sufficient"] is True
    assert result["shortfall"] == 0


def test_check_capital_sufficiency_shortfall():
    result = check_capital_sufficiency(available_capital=70000, required_margin=100000)
    assert result["sufficient"] is False
    assert result["shortfall"] == 30000