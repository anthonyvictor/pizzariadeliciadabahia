import { colors } from "@styles/colors";
import { useChecklist } from "../context";
import { ChecklistHeaderStyle } from "../styles";
import { ChecklistSearch } from "./search";

export const ChecklistHeader = () => {
  const {
    label,
    description,
    required,
    value,
    hideSearch,
    allowSearch,
    search,
    setSearch,
    min,
    max,
    isDone,
  } = useChecklist();
  const statusBadge = isDone ? `Ok ☑️` : required ? "Obrig. ⚠️" : `Opcional`;
  const statusColor = isDone
    ? {
        backgroundColor: colors.checkedLight,
        color: `#000`,
      }
    : required
    ? { backgroundColor: "#000", color: `#fff` }
    : { backgroundColor: `transparent`, color: `#fff` };

  const lenBadge = `${value.length}${min && min === max ? `` : ` selec.`}`;
  const minBadge = min < 1 || min === 1 ? "" : ` / min: ${min}`;
  const maxBadge = max > 99 ? "" : ` / max: ${max}`;
  // const minMaxBadge =
  //   min && min === max ? ` / ${min}` : `${minBadge}${maxBadge}`;
  return (
    <ChecklistHeaderStyle>
      <div className="relative-container">
        <aside>
          <h4>{label}</h4>
          <small style={{ fontSize: "0.8rem" }}>{description}</small>
        </aside>
        <aside className="badge-search">
          <small
            className="badge"
            style={{
              ...statusColor,
            }}
          >
            <span className="status">{statusBadge}</span>
            {/* <span className="len">
              {lenBadge}
              {minBadge}
              {maxBadge}
            </span> */}
          </small>

          {allowSearch && !hideSearch && <ChecklistSearch />}
        </aside>
      </div>
    </ChecklistHeaderStyle>
  );
};

//  {!!required && (
//             <small className="badge">
//               {lenBadge}
//               {minMaxBadge}
//               {/* {value.length
//                 ? `${
//                     max > 99
//                       ? `${value.length} selecionados`
//                       : `${value.length} / ${max}`
//                   }${isDone ? doneBadge : ""}`
//                 : ``} */}
//             </small>
//           )}
