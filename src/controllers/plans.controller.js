import { Plan } from "../models/Plan.js";
import { DEFAULT_PLANS } from "../data/default-plans.js";

export async function listPlans(_req, res, next) {
  try {
    const plans = await Plan.find().sort({ basePrice: 1 }).lean();
    res.json({ plans });
  } catch (error) {
    next(error);
  }
}

export async function seedDefaultPlans(_req, res, next) {
  try {
    await Promise.all(
      DEFAULT_PLANS.map((plan) =>
        Plan.findOneAndUpdate({ slug: plan.slug }, plan, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }),
      ),
    );

    const plans = await Plan.find().sort({ basePrice: 1 }).lean();

    res.status(201).json({ plans });
  } catch (error) {
    next(error);
  }
}
