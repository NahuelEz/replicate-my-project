import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface InvestmentCalculatorProps {
  minInvestment: number;
  annualReturn: number;
  capitalGain: number;
  deliveryDate: string;
}

export const InvestmentCalculator = ({
  minInvestment,
  annualReturn,
  capitalGain,
  deliveryDate,
}: InvestmentCalculatorProps) => {
  const [investmentAmount, setInvestmentAmount] = useState(minInvestment);
  const maxInvestment = minInvestment * 10;

  // Calculate years until delivery
  const yearsUntilDelivery = useMemo(() => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const years = (delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return Math.max(1, Math.ceil(years));
  }, [deliveryDate]);

  // Real-time calculations
  const calculations = useMemo(() => {
    const yearlyReturn = investmentAmount * (annualReturn / 100);
    const totalAnnualReturn = yearlyReturn * yearsUntilDelivery;
    const capitalGainAmount = investmentAmount * (capitalGain / 100);
    const totalProjectedValue = investmentAmount + totalAnnualReturn + capitalGainAmount;

    // Fixed deposit comparison (5% annual in USD)
    const fixedDepositRate = 5;
    const fixedDepositReturn = investmentAmount * (fixedDepositRate / 100) * yearsUntilDelivery;
    const fixedDepositTotal = investmentAmount + fixedDepositReturn;
    const difference = totalProjectedValue - fixedDepositTotal;
    const percentageBetter = ((difference / fixedDepositTotal) * 100).toFixed(1);

    return {
      yearlyReturn,
      totalAnnualReturn,
      capitalGainAmount,
      totalProjectedValue,
      fixedDepositReturn,
      fixedDepositTotal,
      difference,
      percentageBetter,
    };
  }, [investmentAmount, annualReturn, capitalGain, yearsUntilDelivery]);

  // Generate chart data
  const chartData = useMemo(() => {
    const data = [];
    const yearlyReturn = investmentAmount * (annualReturn / 100);
    
    for (let year = 0; year <= yearsUntilDelivery; year++) {
      const accumulatedReturn = yearlyReturn * year;
      const value = year === yearsUntilDelivery 
        ? investmentAmount + accumulatedReturn + calculations.capitalGainAmount
        : investmentAmount + accumulatedReturn;
      
      data.push({
        year: year === 0 ? "Hoy" : `Año ${year}`,
        valor: Math.round(value),
      });
    }
    
    return data;
  }, [investmentAmount, annualReturn, yearsUntilDelivery, calculations.capitalGainAmount]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background to-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Calculadora de Retorno de Inversión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Investment Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Monto a invertir</label>
            <motion.div
              key={investmentAmount}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-primary"
            >
              {formatCurrency(investmentAmount)}
            </motion.div>
          </div>
          <Slider
            value={[investmentAmount]}
            onValueChange={(value) => setInvestmentAmount(value[0])}
            min={minInvestment}
            max={maxInvestment}
            step={minInvestment / 10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(minInvestment)}</span>
            <span>{formatCurrency(maxInvestment)}</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 rounded-lg bg-background/50 p-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Percent className="h-4 w-4" />
              Retorno Anual
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculations.yearlyReturn)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-2 rounded-lg bg-background/50 p-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Ganancia de Capital
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculations.capitalGainAmount)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2 rounded-lg bg-background/50 p-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Años de Inversión
            </div>
            <div className="text-2xl font-bold">
              {yearsUntilDelivery} {yearsUntilDelivery === 1 ? "año" : "años"}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2 rounded-lg bg-primary/10 p-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Valor Total Proyectado
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(calculations.totalProjectedValue)}
            </div>
          </motion.div>
        </div>

        {/* Projection Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Proyección de Crecimiento</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fixed Deposit Comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-border/50 bg-background/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Mismo monto en Plazo Fijo (5% anual USD)
            </span>
            <span className="font-semibold">{formatCurrency(calculations.fixedDepositTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Diferencia a tu favor</span>
            <span className="text-lg font-bold text-green-600">
              +{formatCurrency(calculations.difference)}
            </span>
          </div>
          <Badge variant="default" className="w-full justify-center py-2">
            {calculations.percentageBetter}% más rentable que plazo fijo
          </Badge>
        </motion.div>
      </CardContent>
    </Card>
  );
};
