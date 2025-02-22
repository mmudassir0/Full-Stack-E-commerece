import React from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import Header from "./card-header";

import { motion } from "framer-motion";

interface CardWrapperProps {
  headerlabel: string;
  children: React.ReactNode;
  headerIcon?: React.ReactNode;
  headeerDescription?: string;
}
const CardWrapper = ({
  headerlabel,
  children,
  headerIcon,
  headeerDescription,
}: CardWrapperProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="jumbo absolute -inset-[10px] opacity-50"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="w-full max-w-lg p-4 relative z-10"
      >
        <Card className="backdrop-blur-xl bg-white/10 shadow-2xl border-0 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />

          <CardHeader>
            <Header
              label={headerlabel}
              Icon={headerIcon}
              headerDescription={headeerDescription}
            />
          </CardHeader>
          <CardContent className="space-y-6 relative ">{children}</CardContent>
        </Card>
      </motion.div>
      <style jsx global>{`
        .jumbo {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke-opacity='0.1'%3E%3Cg stroke='%23026' stroke-width='17'%3E%3Cline x1='-8' y1='-8' x2='808' y2='808'/%3E%3Cline x1='-8' y1='792' x2='808' y2='1592'/%3E%3Cline x1='-8' y1='-808' x2='808' y2='8'/%3E%3C/g%3E%3Cg stroke='%23002163' stroke-width='16'%3E%3Cline x1='-8' y1='767' x2='808' y2='1567'/%3E%3Cline x1='-8' y1='17' x2='808' y2='817'/%3E%3Cline x1='-8' y1='-33' x2='808' y2='767'/%3E%3Cline x1='-8' y1='-783' x2='808' y2='33'/%3E%3C/g%3E%3Cg stroke='%23002060' stroke-width='15'%3E%3Cline x1='-8' y1='742' x2='808' y2='1542'/%3E%3Cline x1='-8' y1='42' x2='808' y2='842'/%3E%3Cline x1='-8' y1='-58' x2='808' y2='742'/%3E%3Cline x1='-8' y1='-758' x2='808' y2='58'/%3E%3C/g%3E%3Cg stroke='%23001f5c' stroke-width='14'%3E%3Cline x1='-8' y1='67' x2='808' y2='867'/%3E%3Cline x1='-8' y1='717' x2='808' y2='1517'/%3E%3Cline x1='-8' y1='-733' x2='808' y2='83'/%3E%3Cline x1='-8' y1='-83' x2='808' y2='717'/%3E%3C/g%3E%3Cg stroke='%23001e59' stroke-width='13'%3E%3Cline x1='-8' y1='92' x2='808' y2='892'/%3E%3Cline x1='-8' y1='692' x2='808' y2='1492'/%3E%3Cline x1='-8' y1='-108' x2='808' y2='692'/%3E%3Cline x1='-8' y1='-708' x2='808' y2='108'/%3E%3C/g%3E%3Cg stroke='%23001d56' stroke-width='12'%3E%3Cline x1='-8' y1='667' x2='808' y2='1467'/%3E%3Cline x1='-8' y1='117' x2='808' y2='917'/%3E%3Cline x1='-8' y1='-133' x2='808' y2='667'/%3E%3Cline x1='-8' y1='-683' x2='808' y2='133'/%3E%3C/g%3E%3Cg stroke='%23001c53' stroke-width='11'%3E%3Cline x1='-8' y1='642' x2='808' y2='1442'/%3E%3Cline x1='-8' y1='142' x2='808' y2='942'/%3E%3Cline x1='-8' y1='-158' x2='808' y2='642'/%3E%3Cline x1='-8' y1='-658' x2='808' y2='158'/%3E%3C/g%3E%3Cg stroke='%23001b4f' stroke-width='10'%3E%3Cline x1='-8' y1='167' x2='808' y2='967'/%3E%3Cline x1='-8' y1='617' x2='808' y2='1417'/%3E%3Cline x1='-8' y1='-633' x2='808' y2='183'/%3E%3Cline x1='-8' y1='-183' x2='808' y2='617'/%3E%3C/g%3E%3Cg stroke='%23001a4c' stroke-width='9'%3E%3Cline x1='-8' y1='592' x2='808' y2='1392'/%3E%3Cline x1='-8' y1='192' x2='808' y2='992'/%3E%3Cline x1='-8' y1='-608' x2='808' y2='208'/%3E%3Cline x1='-8' y1='-208' x2='808' y2='592'/%3E%3C/g%3E%3Cg stroke='%23001949' stroke-width='8'%3E%3Cline x1='-8' y1='567' x2='808' y2='1367'/%3E%3Cline x1='-8' y1='217' x2='808' y2='1017'/%3E%3Cline x1='-8' y1='-233' x2='808' y2='567'/%3E%3Cline x1='-8' y1='-583' x2='808' y2='233'/%3E%3C/g%3E%3Cg stroke='%23001846' stroke-width='7'%3E%3Cline x1='-8' y1='242' x2='808' y2='1042'/%3E%3Cline x1='-8' y1='542' x2='808' y2='1342'/%3E%3Cline x1='-8' y1='-558' x2='808' y2='258'/%3E%3Cline x1='-8' y1='-258' x2='808' y2='542'/%3E%3C/g%3E%3Cg stroke='%23001743' stroke-width='6'%3E%3Cline x1='-8' y1='267' x2='808' y2='1067'/%3E%3Cline x1='-8' y1='517' x2='808' y2='1317'/%3E%3Cline x1='-8' y1='-533' x2='808' y2='283'/%3E%3Cline x1='-8' y1='-283' x2='808' y2='517'/%3E%3C/g%3E%3Cg stroke='%2300163f' stroke-width='5'%3E%3Cline x1='-8' y1='292' x2='808' y2='1092'/%3E%3Cline x1='-8' y1='492' x2='808' y2='1292'/%3E%3Cline x1='-8' y1='-308' x2='808' y2='492'/%3E%3Cline x1='-8' y1='-508' x2='808' y2='308'/%3E%3C/g%3E%3Cg stroke='%2300153c' stroke-width='4'%3E%3Cline x1='-8' y1='467' x2='808' y2='1267'/%3E%3Cline x1='-8' y1='317' x2='808' y2='1117'/%3E%3Cline x1='-8' y1='-333' x2='808' y2='467'/%3E%3Cline x1='-8' y1='-483' x2='808' y2='333'/%3E%3C/g%3E%3Cg stroke='%23001439' stroke-width='3'%3E%3Cline x1='-8' y1='342' x2='808' y2='1142'/%3E%3Cline x1='-8' y1='442' x2='808' y2='1242'/%3E%3Cline x1='-8' y1='-458' x2='808' y2='358'/%3E%3Cline x1='-8' y1='-358' x2='808' y2='442'/%3E%3C/g%3E%3Cg stroke='%23001336' stroke-width='2'%3E%3Cline x1='-8' y1='367' x2='808' y2='1167'/%3E%3Cline x1='-8' y1='417' x2='808' y2='1217'/%3E%3Cline x1='-8' y1='-433' x2='808' y2='383'/%3E%3Cline x1='-8' y1='-383' x2='808' y2='417'/%3E%3C/g%3E%3Cg stroke='%23013' stroke-width='1'%3E%3Cline x1='-8' y1='392' x2='808' y2='1192'/%3E%3Cline x1='-8' y1='-408' x2='808' y2='408'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          animation: jumbo 60s linear infinite;
        }
        @keyframes jumbo {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CardWrapper;
