/** Illustrative material estimate helpers. Not vendor quotes. */

export function materialLineCost(item) {
  const quantity = Math.max(0, Number(item?.quantity) || 0);
  const unitCost = Number(item?.unitCost);
  if (!Number.isFinite(unitCost) || unitCost < 0) return 0;
  return quantity * unitCost;
}

export function planMaterialsEstimate(plan) {
  return (plan?.materials ?? []).reduce((sum, item) => sum + materialLineCost(item), 0);
}

export function designPlanEstimate(design) {
  return planMaterialsEstimate(design?.implementationPlan);
}

export function budgetCategoryTotal(categories = []) {
  return categories.reduce((sum, item) => {
    const amount = Number(item?.amount);
    return sum + (Number.isFinite(amount) && amount > 0 ? amount : 0);
  }, 0);
}

export function budgetAllocated(budget, designs = []) {
  const manual = budgetCategoryTotal(budget?.categories);
  const designIds = budget?.designIds ?? [];
  const fromDesigns = designIds.reduce((sum, id) => {
    const design = designs.find((entry) => entry.id === id);
    return sum + designPlanEstimate(design);
  }, 0);
  return manual + fromDesigns;
}
